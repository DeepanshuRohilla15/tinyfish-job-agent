import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    try{
        const formData = await req.formData();

        const role = formData.get("role");
        const location = formData.get("location");
        const resume = formData.get("resume");

        console.log("Incoming Request:");
        console.log({ role, location, resume });

        //call TinyFish API here

        // Dummy response (simulate jobs found)
        const jobs = [
            {
                title: "Backend Engineer",
                company: "Amazon",
                status: "Applied"
            },
            {
                title : "Software Engineer",
                company : "Google",
                status : "Pending"
            }
        ];

        return NextResponse.json({success : true, jobs});
    }
    catch(error){
        return NextResponse.json(
            {success : false, error: "Something went wrong"},
            {status : 500}
        );
    }
}