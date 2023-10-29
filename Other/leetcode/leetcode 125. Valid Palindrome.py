def convert_to_lower_case(phrase):
	stripped_word = ""
	for i, character in enumerate(phrase):
		if 65 <= ord(character) and ord(character) <= 90:
			stripped_word += character.lower()
		if (97 <= ord(phrase[i]) and ord(phrase[i]) <= 122) or (48 <= ord(phrase[i]) and ord(phrase[i]) <= 57):
			stripped_word += character
	return stripped_word

def check_if_palindrome(phrase):
	for i in range(len(phrase) // 2):
        if phrase[i] != phrase[-(i + 1)]:
            return False

	return True

def valid_palindrome(phrase):
	lower_case_phrase = convert_to_lower_case(phrase)
	return check_if_palindrome(lower_case_phrase)

print(valid_palindrome("A man, a plan, a canal: Panama"))
print(valid_palindrome("race a car"))
print(valid_palindrome("0P"))
