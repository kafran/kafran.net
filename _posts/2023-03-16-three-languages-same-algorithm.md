---
title: "Three languages, one algorithm"
excerpt: "Implementing the same algorithm in Python, Swift and Go."
last_modified_at: 2023-03-16T11:11:00-03:00
tags: 
  - python
  - swift
  - go
---

The three languages I have been using the most are Python, Swift, and Go. Today I was trying to implement an easy LeetCode problem in these three languages for fun.

The problem is the famous **Two Sum**: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target".

It's incredible how fast Go is. It's also amazing how fast Python got in the last few years, LeetCode uses Python 3.10. Despite being the language I enjoy the most, I was slightly disappointed by Swift.

## Python

* Runtime: 44ms
* Memory: 15.1 MB

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        map_ = dict()
        for i, v in enumerate(nums):
            comp = target - v
            if comp in map_:
                return [map_.get(comp), i]
            map_[v] = i        
```

## Swift

* Runtime: 45ms
* Memory: 14.5 MB

```swift
class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        var map: [Int:Int] = [:]
        for (i, v) in nums.enumerated() {
            let compl = target - v
            if let compl = map[compl] {
                return [compl, i]
            }
            map[v] = i
        }
        return []
    }
}
```

## Go

* Runtime: 9ms
* Memory: 4.4 MB

```go
func twoSum(nums []int, target int) []int {
   m := make(map[int]int)
   for i, v := range nums {
       c := target - v
       if c, ok := m[c]; ok {
           return []int{c, i}
       }
       m[v] = i
   }
   return []int{}
}
```