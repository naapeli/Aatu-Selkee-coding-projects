def roman_to_int(numeral: str):
    total = 0
    for i in range(len(numeral)):
        try:
            if numeral[i] == "I" and (numeral[i + 1] == "V" or numeral[i + 1] == "X"):
                total -= 1
            elif numeral[i] == "X" and (numeral[i + 1] == "L" or numeral[i + 1] == "C"):
                total -= 10
            elif numeral[i] == "C" and (numeral[i + 1] == "D" or numeral[i + 1] == "M"):
                total -= 100
            elif numeral[i] == "I":
                total += 1
            elif numeral[i] == "V":
                total += 5
            elif numeral[i] == "X":
                total += 10
            elif numeral[i] == "L":
                total += 50
            elif numeral[i] == "C":
                total += 100
            elif numeral[i] == "D":
                total += 500
            elif numeral[i] == "M":
                total += 1000
        except IndexError:
            if numeral[i] == "I":
                total += 1
            elif numeral[i] == "V":
                total += 5
            elif numeral[i] == "X":
                total += 10
            elif numeral[i] == "L":
                total += 50
            elif numeral[i] == "C":
                total += 100
            elif numeral[i] == "D":
                total += 500
            elif numeral[i] == "M":
                total += 1000
    return total


# better solution
def roman_to_int2(numeral: str):
    total = 0
    values = {
            "I": 1,
            "V": 5,
            "X": 10,
            "L": 50,
            "C": 100,
            "D": 500,
            "M": 1000}
    real_numeral = numeral.replace("IV", "IIII").replace("IX", "VIIII").replace("XL", "XXXX").replace("XC", "LXXXX").replace("CD", "CCCC").replace("CM", "DCCCC")
    for char in real_numeral:
        total += values[char]
    return total


print(roman_to_int("III"))
print(roman_to_int("LVIII"))
print(roman_to_int("MCMXCIV"))
print(roman_to_int("IX"))
print(roman_to_int2("III"))
print(roman_to_int2("LVIII"))
print(roman_to_int2("MCMXCIV"))
print(roman_to_int2("IX"))