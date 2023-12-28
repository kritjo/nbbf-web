import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/tabs";
import Medlemmer from "@/styresider/medlemmer";
import Soknader from "@/styresider/soknader";

export default function StyreHome() {

  return (
    <div className="flex w-full justify-center items-center">
      <Tabs defaultValue="account" className="max-w-[800px] w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medlemmer">Medlemmer</TabsTrigger>
          <TabsTrigger value="soknader">Søknader</TabsTrigger>
        </TabsList>
        <TabsContent value="medlemmer"><Medlemmer /></TabsContent>
        <TabsContent value="soknader"><Soknader /></TabsContent>
      </Tabs>
    </div>
  )
}