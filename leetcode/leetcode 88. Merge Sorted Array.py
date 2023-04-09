from typing import List


def merge(nums1: List[int], m: int, nums2: List[int], n: int) -> None:
    first = nums1[0: m]
    second = nums2[0: n]
    index = 0
    while index < m + n:
        if second != []:
            if index < len(first) and first[index] <= second[0]:
                index += 1
            else:
                first.insert(index, second.pop(0))
                index += 1
        else:
            return first
    return first


print(merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3))
print(merge([1], 1, [], 0))
print(merge([], 0, [1], 1))
print(merge([1, 2, 3, 7, 10, 11, 0, 0, 0], 6, [2, 5, 6], 3))
print(merge([2, 5, 6], 3, [1, 2, 3, 7, 10, 11, 0, 0, 0], 6))
