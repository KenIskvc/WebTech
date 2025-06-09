// DTO interfaces matching backend models

export interface TopicDto {
  Id: number;
  Name: string;
  Tasks?: TaskDto[];
  // Additional properties from dummy data
  icon?: string;
  color?: string;
  autoDelete?: number;
}

export interface TaskDto {
  Id: number;
  Title: string;
  Description?: string;
  TopicId: number;
  DueDate?: string;
  IsDone: boolean;
  Priority?: string;
}

export interface UserDto {
  Id: string;
  UserName: string;
  Email: string;
}
