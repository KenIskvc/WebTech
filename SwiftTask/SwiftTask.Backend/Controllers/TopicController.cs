using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SwiftTask.Backend.Models;
using Task = SwiftTask.Backend.Models.Task;

namespace SwiftTask.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private static readonly string[] Topics = new[]
        {
            "Mathematik", "WebTech", "NETA", "Programmieren"
        };


        [HttpGet(Name = "GetTopics")]
        public List<Topic> Get()
        {
            var topicList = new List<Topic>();

            foreach (var topic in Topics)
            {
                var newTopic = new Topic(topic);
                var newTask = new Task("Aufgabe 2");
                newTopic.Tasks.Add(newTask);
                topicList.Add(newTopic);
            }

            return topicList;
        }
    }
}
