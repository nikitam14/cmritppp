"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import axios from "axios";
import toast from "react-hot-toast";
import { Job } from "@prisma/client";
import { ComboBox } from "@/components/ui/combo-box";
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";

interface TagsFormProps {
  initialData: Job
  jobId: string; 
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagsForm = ({ initialData, jobId }: TagsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const[jobTags,setjobTags]=useState<string[]>(initialData.tags)

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        const response=await axios.patch(`/api/jobs/${jobId}`, values);
        toast.success("Job Description Updated");
        toggleEditing();
        router.refresh();
    } catch (error) {
        toast.error("Something went wrong")
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  // const handlePromptGeneration = async () => {
  //   try {
  //     setIsPrompting(true);
  //     const customPrompt= `Generate an array of top 10 keywords related to the job profession "${prompt}".These keywords should encompass various aspects of the profession, including skills, responsibilities, tools and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represnt the breadth of the profession. your output should be a list/array of keywords. Just return me the array alone.`;
      
  //     await getGenerativeAIResponse(customPrompt).then((data)=> {
        
  //       // check the data response is an array or not
  //       if(Array.isArray(JSON.parse(data))){
  //         console.log("in client side:", JSON.parse(data))
  //         setjobTags((prevTags)=> [...prevTags, ...JSON.parse(data)]);
  //       }
  //       setIsPrompting(false);
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     toast.error("Something went wrong...")
  //   }
  // }
  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate a JSON array of exactly 10 concise and relevant job-related tags for the profession "${prompt}". These tags should strictly focus on the most important skills, technologies, tools, and qualifications commonly associated with this profession. Avoid generic terms, responsibilities, or vague categories. Your output must only include the JSON array.`;
  
      const data = await getGenerativeAIResponse(customPrompt);
  
      // Clean up the response: remove unexpected prefixes
      const cleanedData = data.trim().replace(/^json/i, '').trim();
      // const cleanedData = data.trim().replace(/^["']?javascript["']?:?/i, '').trim();
  
  
      // Attempt to parse the cleaned response
      try {
        const parsedData = JSON.parse(cleanedData);
        if (Array.isArray(parsedData)) {
          
          setjobTags((prevTags) => [...prevTags, ...parsedData]);
        } else {
          console.error("Response is not an array:", parsedData);
          toast.error("Invalid response format");
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast.error("Invalid JSON response");
      }
      setIsPrompting(false);
    } catch (error) {
      console.error("Error during prompt generation:", error);
      toast.error("Something went wrong...");
      setIsPrompting(false);
    }
  };
  

  const handleTagRemove = (index:number)=>{
    const updatedTags = [...jobTags]
    updatedTags.splice(index, 1)
    setjobTags(updatedTags);
  }

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display the tags if not editing */}
      {!isEditing && 
        <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0 ? (
            initialData.tags.map((tag, index)=>(
              <div className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100" key={index}>
                {tag}
              </div>
            ))
          ):(<p>No tags</p>) }
        </div>
      }            

      {/* display the category id if not editing
      {!isEditing && <p className="text-sm mt-2">{initialData.categoryId}</p>} */}

      {/* On editing mode display the input */}
      {isEditing && ( <>
        <div className="flex items-center gap-2 my-2">
          <input type="text" placeholder="e.g 'Full- stack developer'" value={prompt} onChange={(e)=> setPrompt(e.target.value)}
          className="w-full p-2 rounded-md"
          />
          {isPrompting ? (<>
            <Button>
              <Loader2 className="w4 h-4 animate-spin"/>
            </Button>
          </>): (<>
            <Button onClick={handlePromptGeneration}>
              <Lightbulb className="w4 h-4"/>
            </Button>
          </>)}
        </div>
        <p className="text-xs text-muted-foreground text-right">Note*: profession Name alone enough to generate the tags</p>

        <div className="flex items-center gap-2 flex-wrap">
        {jobTags.length > 0 ? (jobTags.map((tag, index) => (
          <div key={index} className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100">
            {tag}{" "} {isEditing && (
              <Button variant={"ghost"} className="p-0 h-auto" onClick={()=> handleTagRemove(index)}>
                <X className="h-3 w-3"/>
              </Button>
            )}
          </div>
        ))) : (<p>No Tags</p>)}
        </div>

        <div className="flex items-center gap-2 justify-end mt-4">
          <Button type="button" variant={"outline"} 
          onClick={()=> { setjobTags([]); onSubmit({tags:[]}) }} disabled={isSubmitting}>
            Clear All
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={()=> onSubmit({tags: jobTags})}>Save</Button>
        </div>
      </>
      )}
    </div>
  );
};
