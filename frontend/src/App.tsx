import { Header } from "./components/Header/Header"
import PassGen from "./pages/PassGen/PassGen"
import { useSearchParams } from 'react-router';
import { PassMan } from "./pages/PassMan/PassMan";

const menu =
{
  "pass-gen": <PassGen />,
  "pass-man": <PassMan />
}

function App() {

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');


  return (
    <div className="bg-bg min-h-screen w-full flex flex-col justify-center px-4">
      <Header />
      {page && menu[page as keyof typeof menu] ? menu[page as keyof typeof menu] : <PassGen />}     
    </div>
  )
}

export default App
