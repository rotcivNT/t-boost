function Conversation() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div
        className={`text-center transition-opacity duration-1000 ${
          true ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-400">TBoost</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Your new workspace for efficient team collaboration and communication.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          { icon: "💬", title: "Chat", description: "Real-time messaging" },
          { icon: "🗂️", title: "Organize", description: "Channels & threads" },
          {
            icon: "🤝",
            title: "Collaborate",
            description: "Share files & ideas",
          },
          {
            icon: "📝",
            title: "Task Management",
            description: "Create & assign tasks, share resources",
          },
          {
            icon: "📹",
            title: "Video Calls",
            description: "Connect with your team",
          },
        ].map((feature, index) => (
          <div
            key={feature.title}
            className={`bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-500 ${
              true ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Conversation;
