export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🍽</div>
      <h1 className="text-3xl font-bold mb-4">About NutriEats</h1>
      <p className="text-gray-500 text-lg mb-8">
        NutriEats is an AI-powered food ordering platform that helps you eat smarter.
        We combine personalized nutrition science with delicious food to help you reach your health goals.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        {[
          { icon: "🤖", title: "AI Recommendations", desc: "Our engine learns your preferences and health goals to suggest the perfect meal every time." },
          { icon: "🥗", title: "Nutrition Tracking", desc: "Every item comes with full nutrition info. Track your daily calorie intake from your dashboard." },
          { icon: "💬", title: "NutriBot", desc: "Our AI chatbot is available 24/7 to answer nutrition questions and help you make healthy choices." },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
