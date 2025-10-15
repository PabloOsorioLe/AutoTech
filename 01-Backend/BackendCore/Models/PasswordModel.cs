namespace BackendCore.Models
{
    public class PasswordModel
    {
        public string Password { get; set; }
    }

    public class ValidatePasswordModel
    {
        public string Password { get; set; }
        public string PasswordHash { get; set; }
    }
}
