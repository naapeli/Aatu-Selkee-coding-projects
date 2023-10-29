def str_str(haystack: str, needle: str) -> int:
    for index in range(len(haystack)):
        if haystack[index:index + len(needle)] == needle:
            return index
    return -1


print(str_str("sadbutsad", "sad"))
print(str_str("sadbutsad", "ad"))
print(str_str("sadbutsad", "sads"))
print(str_str("sadbutsad", "but"))
print(str_str("sadbbutsad", "but"))
