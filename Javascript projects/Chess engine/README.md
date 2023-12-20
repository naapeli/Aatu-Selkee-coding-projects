This is an attempt of beating my friend at chess who is a lot better than me. Since my ability to play chess is not as good as their's, I still wanted to challenge them. Therefore my only option was to utilise my knowledge of coding to evaluate many more positions than they can. It turned out to be way more challenging than I thought, however I learned a lot during studying for this project. I ended up including the following techniques:

1. Self-made movegenerator (without biitboards and using purely logic)
2. Negamax with iterative deepening and alpha-beta pruning
3. Quiescence search to look at captures to unlimited depth
4. Transposition table with zobrist hashing to store already evaluated positions and remember positions for threefold repetition
5. (soon late-move-reductions, delta pruning, null-move pruning and maybe an opening book if I have time?)

I estimate my bot to be around 1000 - 1500. It is good at recognizing tactics, however lacks knowledge of king safety and endgames. I play pretty evenly against it and lose most often due to a tactical oversight on my part.
