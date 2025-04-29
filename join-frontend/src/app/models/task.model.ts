export class Task {
  constructor(
    public title: string,
    public description: string,
    public assignedContacts: string[],
    public dueDate: Date | null,
    public priority: 'urgent' | 'medium' | 'low',
    public category: string,
    public subtasks: { title: string, status: 'in-progress' | 'completed' }[],
    public status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done',
  ) { }
}
