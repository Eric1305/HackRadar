import "@/index.css";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  type Hackathon = {
    id: number;
    name: string;
    state_region: string;
    start_date: string;
    end_date: string;
  };

  useEffect(() => {
    async function load() {
      const res = await fetch("http://localhost:4000/api/hackathons");
      const data = await res.json();
      setHackathons(data);
    }

    load();
  }, []);
  return (
    <div className="dark bg-black p-5 rounded-2xl">
      <Table>
        <TableCaption>A list of Hackathons</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Hackathon</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hackathons.map((hackathon) => (
            <TableRow key={hackathon.id}>
              <TableCell className="font-medium text-white">
                {hackathon.name}
              </TableCell>
              <TableCell className="text-white">
                {hackathon.state_region ? hackathon.state_region : "Virtual"}
              </TableCell>
              <TableCell className="text-white">
                {hackathon.start_date.slice(0, 10)}
              </TableCell>
              <TableCell className="text-right text-white">
                {hackathon.end_date.slice(0, 10)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
