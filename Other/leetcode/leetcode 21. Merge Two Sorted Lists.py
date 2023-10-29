from typing import List


# own first solution


def merge_two_lists(list1: List[int], list2: List[int]) -> List[int]:
    sorted_list = []
    index_1 = 0
    index_2 = 0

    while index_2 < len(list2):
        while index_1 < len(list1) and list1[index_1] <= list2[index_2]:
            sorted_list.append(list1[index_1])
            index_1 += 1
        sorted_list.append(list2[index_2])
        index_2 += 1
    while index_1 < len(list1):
        sorted_list.append(list1[index_1])
        index_1 += 1

    return sorted_list

# better own solution (clearer)


def merge_two_lists2(list1: List[int], list2: List[int]) -> List[int]:
    sorted_list = []

    def merge(list_1: List[int], list_2: List[int]) -> (List[int], List[int]):
        if list_1[0] <= list_2[0]:
            sorted_list.append(list_1[0])
            del list_1[0]
        else:
            sorted_list.append(list_2[0])
            del list_2[0]
        return list_1, list_2

    while list1 != [] and list2 != []:
        (list1, list2) = merge(list1, list2)
    sorted_list += list1 + list2
    return sorted_list


print(merge_two_lists([1, 2, 4], [1, 3, 4]))
print(merge_two_lists([], []))
print(merge_two_lists([], [0]))
print(merge_two_lists([1, 2, 4, 6, 7, 8], [1, 3, 4, 5]))
print(merge_two_lists([1, 1, 4, 4, 4, 5], [1, 3, 4, 5]))
print(merge_two_lists2([1, 2, 4], [1, 3, 4]))
print(merge_two_lists2([], []))
print(merge_two_lists2([], [0]))
print(merge_two_lists2([1, 2, 4, 6, 7, 8], [1, 3, 4, 5]))
print(merge_two_lists2([1, 1, 4, 4, 4, 5], [1, 3, 4, 5]))