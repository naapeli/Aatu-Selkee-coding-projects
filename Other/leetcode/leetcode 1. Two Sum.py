from typing import List


def twoSum(nums: List[int], target: int):
    for a in range(0, len(nums)):
        for b in range(a + 1, len(nums)):
            if nums[a] + nums[b] == target:
                return [a, b]

# own solution (worse, because more computations)
# def twoSum(nums: List[int], target: int):
#     for a in range(len(nums)):
#         for b in range(len(nums)):
#             if a != b and nums[a] + nums[b] == target:
#                 return [a, b]


# better solution using a hashmap
def twoSum2(nums: List[int], target: int):
    hashmap = {}
    for i in range(len(nums)):
        hashmap[nums[i]] = i
    for i in range(len(nums)):
        complement = target - nums[i]
        if complement in hashmap and hashmap[complement] != i:
            return [i, hashmap[complement]]


print(twoSum2([2, 7, 11, 15], 9))
print(twoSum2([3, 2, 4], 6))
print(twoSum2([3, 3], 6))
print(twoSum([2, 7, 11, 15], 9))
print(twoSum([3, 2, 4], 6))
print(twoSum([3, 3], 6))