export function calculateScore(moves: number, timeInSeconds: number): number {
  // Define scoring parameters
  const maxMoves: number = 100; // Adjust as needed
  const maxTime: number = 3600; // Adjust as needed

  // Calculate normalized values
  const normalizedMoves: number = Math.min(moves / maxMoves, 1);
  const normalizedTime: number = Math.min(timeInSeconds / maxTime, 1);

  // Calculate score
  const score: number = (1 - normalizedMoves) * (1 - normalizedTime) * 100;

  return Math.round(score);
}
