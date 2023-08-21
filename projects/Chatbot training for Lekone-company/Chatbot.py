from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from clean_data import collect_consecutive_messages

personal_chatbot = ChatBot("Aatu")

trainer = ListTrainer(personal_chatbot)

clean_data = collect_consecutive_messages("data.txt")
print(clean_data)

trainer.train(clean_data)

# trainer.train(["Moi, miten menee?", "Erinomaisesti, kiitos kysymästä!"])

while True:
	statement = input("Please type a message: ")
	if statement in ("quit", "exit"):
		break
	else:
		print(f"Response: {personal_chatbot.get_response(statement)}")
