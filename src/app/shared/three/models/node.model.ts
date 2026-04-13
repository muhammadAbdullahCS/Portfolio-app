export type NeuralNodeType = 'skill' | 'project' | 'experience';

export interface NeuralNodeData {
  id: string;
  type: NeuralNodeType;
  title: string;
  description: string;
  /** IDs of connected nodes (undirected edges). */
  connections: string[];
}
