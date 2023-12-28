This is an attempt of beating my friend at chess who is a lot better than me. Since my ability to play chess is not as good as their's, I still wanted to challenge them. Therefore my only option was to utilise my knowledge of coding to evaluate many more positions than they can. It turned out to be way more challenging than I thought, however I learned a lot during studying for this project. I ended up including the following techniques:

1. Self-made movegenerator (without bitboards and using purely logic)
2. Negamax with iterative deepening and alpha-beta pruning
3. Quiescence search to look at captures to unlimited depth
4. Transposition table with zobrist hashing to store already evaluated positions and remember positions for threefold repetition (a bug somewhere)
5. Late-move-reductions
6. Delta pruning
7. Aspiration windows
8. History heuristic for quiet move ordering
9. null-move pruning

I estimate my bot to be around 1500. It is good at recognizing tactics, however lacks knowledge of the opening stage of the game. At the moment I usually lose to it due to a tactical oversight on my part. Sometimes I can win by attacking it's king aggressively.

In the beginning I wanted to use this project to learn Javascript while making a fun project, however I found out that it probably would've been better to make this project in for example C# or Scala (from the languages I know). This would've allowed me to use 64-bit numbers for representing the board. This would've allowed me to use bit operations for move creation, which would've made my engine way faster. Also in the beginning I knew very little about frontends and backends. It would've been better to make the engine in the backend and request the engine moves to the frontend as that way I could've implemented an opening book easier. It would've been more elegant to do this project that way. That being said, I'm satisfied with my learning outcome from this project and overall I managed to make a pretty compenent bot using an unusual programming for this type of project.

Here are some pictures from the project:
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/60d64af9-78b2-40db-be9e-3967bcc40826)
![image](https://github.com/naapeli/Aatu-Selkee-coding-projects/assets/130310206/5ce5f4ab-7473-4a6a-b1ff-bdd4c48c5086)
