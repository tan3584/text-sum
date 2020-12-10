export class TopicResponse {
  id: number;
  updatedAt: Date;
  createdAt: Date;
  subject: string;
  description: string;

  constructor(partial: Partial<TopicResponse>) {
    Object.assign(this, partial);
  }
}
