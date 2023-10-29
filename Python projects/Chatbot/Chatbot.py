import json
import os
from difflib import get_close_matches


CURRENT_DIRECTORY = os.getcwd()

def load(filepath):
	with open(filepath) as db:
		data = json.load(db)
	return data

def save(filepath, data):
	with open(filepath, "w") as db:
		json.dump(data, db, indent=2)

def find_best_match(question, possible_matches):
	matches = get_close_matches(question, possible_matches, n=1, cutoff=0.8)
	if matches:
		return matches[0]
	else:
		return ""
	
def get_closest_answer(question, database):
	for possible_right_question in database["questions"]:
		if question == possible_right_question["question"]:
			return possible_right_question["answer"] 


if __name__ == "__main__":
	database = load(CURRENT_DIRECTORY + "/database.json")
	exit_conditions = {"exit", "quit", "end"}

	print("Hello! I am a chat bot that answers questions relating to a job application at a company called Lekane. Go ahead and ask a question or type in example questions to see some suggestions.")

	while True:
		user_input = input(r"Please ask a question or exit: ")

		if user_input.lower() in exit_conditions:
			break

		best_match = find_best_match(user_input, [question_answers["question"] for question_answers in database["questions"]])

		if best_match != "":
			answer = get_closest_answer(best_match, database)
			print("Service provider: " + answer)
		else:
			new_answer = input("Service provider: Sorry, I didn't quite catch that. Please give an answer, try again or end conversation. For an answer, write answer, for a new try, write try again.\nYou: ").lower()
			if new_answer in exit_conditions:
				break
			elif new_answer == "new try":
				continue
			elif new_answer == "answer":
				correct_answer = input(r"You: The correct answer is ")
				database["questions"].append({"question": user_input, "answer": correct_answer})
				save(CURRENT_DIRECTORY + "/database.json", database)
				print(r"Service provider: Thank you for teaching me!")
