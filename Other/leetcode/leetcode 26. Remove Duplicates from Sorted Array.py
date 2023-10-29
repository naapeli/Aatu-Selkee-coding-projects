from typing import List


# solution allocates more memory than allowed


def remove_duplicates(numbers: List[int]):
    new_list = []
    removed = 0
    added = 0
    while numbers:
        if not new_list:
            new_list.append(numbers[0])
            del numbers[0]
            added += 1
        elif new_list[-1] != numbers[0]:
            new_list.append(numbers[0])
            del numbers[0]
            added += 1
        else:
            removed += 1
            del numbers[0]
    for i in range(removed):
        new_list.append('_')
    return added, new_list

# a better solution from leetcode with own addition


def remove_duplicates_2(nums: List[int]) -> tuple[int, list[int]]:
    j = 0
    for i in range(1, len(nums)):
        if nums[j] != nums[i]:
            j += 1
            nums[j] = nums[i]

    for i in range(j + 1, len(nums)):
        nums[i] = '_'
    return j + 1, nums


print(remove_duplicates([1, 1, 2]))
print(remove_duplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))
print(remove_duplicates_2([1, 1, 2]))
print(remove_duplicates_2([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]))