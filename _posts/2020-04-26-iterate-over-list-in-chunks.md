---
title: "The Pythonic way to iterate over a list in chunks"
excerpt: "Today I was trying to parse some Fixed Width Text Files at work and I came across with the following problem: what's the most beautiful pythonic way to iterate over a list in chunks?"
last_modified_at: 2020-04-26T16:14:00-03:00
tags: 
  - python
---

Today I was trying to parse some Fixed Width Text Files at work and I came across with the following problem: what's the most beautiful pythonic way to iterate over a list in chunks? 

Kidding, I don't know if this is the best way but I am luck enough to be working with Python 3.8 and this seems to be a good opportunity to use the new Walrus `:=` operator.

[This even seems to be a popular question on Stack Overflow](https://stackoverflow.com/a/61435714/3147247).

```python
from itertools import islice

list_ = [i for i in range(10, 100)]

def chunker(it, size):
    iterator = iter(it)
    while chunk := list(islice(iterator, size)):
        print(chunk)
```

```python
In [2]: chunker(list_, 10)
[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
[20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
[30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
[40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
[50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
[60, 61, 62, 63, 64, 65, 66, 67, 68, 69]
[70, 71, 72, 73, 74, 75, 76, 77, 78, 79]
[80, 81, 82, 83, 84, 85, 86, 87, 88, 89]
[90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
```
