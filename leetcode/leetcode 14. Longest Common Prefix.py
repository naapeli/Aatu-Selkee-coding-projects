from typing import List


def longest_common_prefix(strs: List[str]):
    def check(first, second):
        prefix = ""
        num = 0
        while num < min(len(first), len(second)) and first[num] == second[num]:
            prefix += first[num]
            num += 1
        return prefix

    min_prefix = strs[0]
    for index in range(1, len(strs)):
        min_prefix = check(min_prefix, strs[index])
    return min_prefix


print(longest_common_prefix(["flower","flow","flight"]))
print(longest_common_prefix(["dog","racecar","car"]))
print(longest_common_prefix(["dog","dogcar","doggo"]))
print(longest_common_prefix(["super","september","silly", "sing"]))
