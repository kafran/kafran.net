---
title: "Swift's OptionSet: an awesome bitwise operation use-case"
excerpt: "I have been avoiding that part of the book which talks about bitwise operators until I saw Swift's OptionSet on iOS frameworks."
date: 2022-11-16 13:00:00 -0300
tags: 
  - swift
---

Coming from a non-technical background with no Computer Science degree, I've had the pleasure of diving into the fascinating world of how computers work through self-learning resources. This curious journey introduced me to [the realm of bits, bytes, and binary systems](https://www.edx.org/course/introduction-computer-science-harvardx-cs50x), alongside an array of complex topics.

However, one concept that eluded my interest for quite some time was [bitwise operators](https://docs.swift.org/swift-book/LanguageGuide/AdvancedOperators.html). The generally intimidating tone of resources and books, often suggesting their use only for "complex stuff", kept me at bay. I could never understand the real utility of using bitwise operators as I never had to do bit twiddling myself for the kind of problems I have been solving so far.

## Why use bitwise operators?

As the name suggests, bitwise operators works on the individual bits.

> Bitwise operators enable you to manipulate the individual raw data bits within a data structure. They’re often used in low-level programming, such as graphics programming and device driver creation. Bitwise operators can also be useful when you work with raw data from external sources, such as encoding and decoding data for communication over a custom protocol.

<cite>The Swift Programming Language Book</cite>
{: .small}

I won't go into the details of how these operators work as [The Swift Programming Language Book](https://docs.swift.org/swift-book/LanguageGuide/AdvancedOperators.html#ID29) do a much better job. Instead, I'll strive to stay focused on a thought-provoking use case, setting the stage for our main discussion: Swift's OptionSet.

Imagine you want to store a boolean value. How much memory would it take? The smallest amount of space a variable can take is 1 byte. The reason for this is that it is the smallest unit of addressable space that a CPU can reference. Even a boolean, which only needs to represent true or false – theoretically just 1 bit – still consumes an entire byte, with the remaining 7 bits merely filling space. This can be a glaring inefficiency when we're aiming for memory conservation.

```swift
let bool = true  // 0b0000_0001
var bool = false // 0b0000_0000
```

In most applications, there are numerous flags at play. Consider Unix file permissions for instance. A user might be granted permission to read, write, execute, or even all of these simultaneously. When you execute `chmod 777 file` in your terminal, this is essentially what you're doing - toggling flags on and off.

To make the most out of the available space programmers would combine multiple flags into a single byte allowing them to store up to 8 different boolean values. So, in one byte you can store up to 8 boolean values.

```swift
let x: UInt8 = 0b0000_0001 // execute - in base 10 this 1
let w: UInt8 = 0b0000_0010 // write - in base 10 this is 2
let r: UInt8 = 0b0000_0100 // read - in base 10 this is 4

let rwx: UInt8 = 0b0000_0111 // read, write, execute - in base 10 this is 7
```

That's why the flag to set permission to read, write and execute is 7. Because the binary integer `0b0000_0111` is the decimal integer `7`. However, to manipulate these individual bits (to turn them on and off), we need some way to identify the specific bits we want to manipulate. Unfortunately, the bitwise operators don’t know how to work with bit positions. Instead, they work with bit masks.

### Bit masks 

A bit mask is a predefined set of bits that are used to select which specific bits will be modified by subsequent operations. In the example above we set 3 masks, one for read, one for write, and another for execute. So, continuing with the example, suppose we want to set the permission to read and write:

```swift
// Masks
let x: UInt8 = 0b0000_0001 // execute
let w: UInt8 = 0b0000_0010 // write
let r: UInt8 = 0b0000_0100 // read

// To set (turn on) a bit we use the bitwise operator OR (|)
let rw: UInt8 = r | w // 0b0000_0110 - in base 10 this is 6
let rwx: UInt8 = r | w | x // 0b0000_0111 - in base 10 this is 7
```

For more detail on all other operators and how these operators work read the excellent [Swift Programming Language Book](https://docs.swift.org/swift-book/LanguageGuide/AdvancedOperators.html#ID29).

Hold on a second, we began this discussion with a promise of memory efficiency. Yet the earlier example doesn’t really seem to save any memory. Normally, 3 booleans would consume 3 bytes. In contrast, the previous example demands 4 bytes (3 bytes to establish the bit masks, and 1 byte for the flag itself).

It's essential to consider scale here. Bit flags truly shine when you're handling numerous identical flag variables. In the previous example, we were focusing solely on one permission set: the user permissions (or owner permissions in Unix terminology). Now, imagine that you also want to set permissions for a group and other users. Or even more challenging, envision setting permissions for 100 users. Instead of one permission set (the owner), now you have 100. Using 3 Booleans per permission set (one for each potential state) would consume 300 bytes of memory. Employing bit flags, you'd need just 3 bytes for the bit masks, and 100 bytes for the bit flag variables, amounting to 103 bytes of memory in total -- roughly a third of the memory usage.

Ok but this is all about Swift and iOS development, why bother to save a few bytes of memory, right? Probably your use case won't scale to tens of thousands or even millions of similar objects to be worth the added complexity.

That being said, there's another scenario where bit flags and bit masks prove beneficial, and it's well-utilized by UIKit and SwiftUI. Imagine a situation where you have a function capable of accepting any combination of eight or more different options – for the sake of simplicity, let's stick with an 8-bit base. One approach to define such a function would be to use eight individual Boolean parameters:

```swift
func someFunc(
    option1: Bool,
    option2: Bool,
    option3: Bool,
    option4: Bool,
    option5: Bool,
    option6: Bool,
    option7: Bool,
    option8: Bool,
) {}
```

Crazy, right? Now imagine you want to call this function with options 2 and 7 set to `true`:

```swift
someFunc(
    option1: false,
    option2: true,
    option3: false,
    option4: false,
    option5: false,
    option6: false,
    option7: true,
    option8: false,
)
```

Well, thanks to [Swift's argument label](https://docs.swift.org/swift-book/LanguageGuide/Functions.html#ID166) this doesn't sacrifice readability but I hope you understand the mess.

## Swift's OptionSet

Swift's OptionSet solves exactly this problem. Take for example the `.padding()` modifier on SwiftUI – used to add a specified amount of padding to one or more edges of the view. The `.padding()` modifier and many other SwiftUI and UIKit functions receive an OptionSet. When you apply a `.padding()` with `[.top, .bottom, .leading, .trailing]` you are not passing an Array of Enum cases, you are passing an OptionSet.

By definition, all option sets conform to the RawRepresentable protocol through inheritance, which allows for the raw value of an option set instance to store the instance's bitfield. This raw value needs to conform to the FixedWidthInteger protocol, such as UInt8 or Int. In turn, the FixedWidthInteger protocol extends the capabilities of the BinaryInteger protocol by including binary bitwise operations, bit shifts, and overflow handling.

Continuing the example above, we could define an OptionSet:

```swift
struct MyEightOptions: OptionSet {
    let rawValue: UInt8 // Stores our flags

    static let option1 = MyEightOptions(rawValue: 0b0000_0001) // 1
    static let option2 = MyEightOptions(rawValue: 0b0000_0010) // 2
    static let option3 = MyEightOptions(rawValue: 0b0000_0100) // 4
    static let option4 = MyEightOptions(rawValue: 0b0000_1000) // 8
    static let option5 = MyEightOptions(rawValue: 0b0001_0000) // 16
    static let option6 = MyEightOptions(rawValue: 0b0010_0000) // 32
    static let option7 = MyEightOptions(rawValue: 0b0100_0000) // 64
    static let option8 = MyEightOptions(rawValue: 0b1000_0000) // 128

    static let all: MyEightOptions = [
        .option1,
        .option2,
        .option3,
        .option4,
        .option5,
        .option6,
        .option7,
        .option8,
    ]
}
```

And then have it in our function instead of all those parameters:

```swift
func someFunc(options: MyEightOptions) {
    if options.contains([.option2, .option7]) {
        print("\(options)") 
    }
} 

someFunc(options: [.option2, .option7]) // MyEightOptions(rawValue: 66)
```

Much cleaner, right? Also, we have context now. In the example above MyEightOptions(rawValue: 66) stores de integer 66 wich is the binary integer `0b0100_0010`, indicating that option2 and option7 are flagged on.

I hope this article has helped you to understand these SwiftUI and UIKit constructs and how OptionSet works behind the scenes.
