import random


def test():
    locations = {1: (random.randint(0, 5), random.randint(0, 5)), 2: (random.randint(0, 5), random.randint(0, 5)),
                 3: (random.randint(0, 5), random.randint(0, 5)), 4: (random.randint(0, 5), random.randint(0, 5)),
                 5: (random.randint(0, 5), random.randint(0, 5)), 6: (random.randint(0, 5), random.randint(0, 5))}
    distances = []
    for key in locations:
        for another_key in locations:
            if key > another_key:
                distance = pow(locations[key][0] - locations[another_key][0], 2) + pow(locations[key][1] - locations[another_key][1], 2)
                if distance in distances or distance == 0:
                    return {1: (0, 0), 2: (0, 0), 3: (0, 0), 4: (0, 0), 5: (0, 0), 6: (0, 0)}
                else:
                    distances.append(distance)
    return locations


def run_test():
    locations = {1: (0, 0), 2: (0, 0), 3: (0, 0), 4: (0, 0), 5: (0, 0), 6: (0, 0)}
    while locations == {1: (0, 0), 2: (0, 0), 3: (0, 0), 4: (0, 0), 5: (0, 0), 6: (0, 0)}:
        locations = test()
    return locations


print(run_test())


# 2 unique solutions {1: (5, 5), 2: (4, 0), 3: (4, 1), 4: (0, 5), 5: (2, 5), 6: (3, 2)} and
# {1: (5, 1), 2: (0, 5), 3: (2, 5), 4: (5, 0), 5: (4, 3), 6: (0, 2)}
