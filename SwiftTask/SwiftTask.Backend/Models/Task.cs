namespace SwiftTask.Backend.Models
{
    public class Task
    {
        public Task(string description)
        {
            Description = description;
        }

        public int Id { get; private set; }
        public string Description { get; set; }
        public int TopicId { get; set; }
        public virtual Topic Topic { get; set; }
    }
}
