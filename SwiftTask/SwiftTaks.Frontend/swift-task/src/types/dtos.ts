// DTO interfaces matching backend models

export interface TopicDto {
  Id: number;
  Name: string;
  SwiftTaskUserId?: string;
  Tasks?: TaskDto[];
  // Frontend-only properties (not sent to backend)
  // These properties are only used in the UI and not sent to the backend
  icon?: string;
  color?: string;
  autoDelete?: number;
}

export interface TaskDto {
  Id: number;
  Title?: string;      // Backend uses Description instead of Title in some cases
  Description?: string;
  TopicId?: number;
  DueDate?: string;
  IsDone?: boolean;
  Priority?: string;
  TopicName?: string;  // Added to match backend DTO
}

export interface UserDto {
  Id: string;
  UserName: string;
  Email: string;
}
