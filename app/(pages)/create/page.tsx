import NavBar from "@/components/Navbar"
import CreateForm from "@/components/CreateForm"

export default function Home(){
    return (
        <>
        <div className="pb-10">
          <div className="w-screen flex flex-col items-center justify-center h-fit mb-4">
            <NavBar />
            <div className="w-screen flex justify-between px-6 -mt-12">
                <div className="w-[40%] ml-20">
                    <CreateForm />
                </div>
            </div>
          </div>
        </div>
        </>
      )
}