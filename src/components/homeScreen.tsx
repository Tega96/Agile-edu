import Header from "./ui/Header";

interface SubjectProps {
    name: string;
    color: string;
    icon: string;
}

const subject: SubjectProps[] = [
    {name: "Mathematics", color: "bg-blue-500", icon: ""},
    {name: "English", color: "bg-purple-500", icon: ""},
    {name: "Physics", color: "bg-green-500", icon: ""},
    {name: "Chemistry", color: "bg-orange-500", icon: ""},
    {name: "Economics", color: "bg-yellow-500", icon: ""},
]

const HomeScreen = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <Header />
            <div className="grid grid-cols-2 gap-4 mb-6">
                {subject.map((sub) => (
                    <div 
                        className={`p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-white ${sub.color}`}
                        key={sub.name}
                    >
                        <div className="text-3xl mb-2">{sub.icon}</div>
                        <div className="font-semibold">{sub.name}</div>
                    </div>
                ))}
            </div>

            {/** Continue and daily challenges */}
            <div className="space-y-4">
                <button className="w-full p-4 bg-white rounded-xl shadow-md font-semibold">Daily Challenge</button>
            </div>
        </div>
    );
};
export default HomeScreen;