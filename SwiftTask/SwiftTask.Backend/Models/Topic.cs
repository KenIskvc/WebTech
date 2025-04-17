namespace SwiftTask.Backend.Models
{
    public class Topic
    {
        public Topic(string name)
        {
            Name = name;
        }

        public int Id { get; private set; }
        public string Name { get; set; }
        public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}
