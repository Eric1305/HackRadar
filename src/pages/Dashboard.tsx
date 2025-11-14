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
import NavBar from "@/components/navbar";

export default function Dashboard() {
  const hackathons = [
    {
      name: "RowdyHacks",
      format: "in-person",
      location: "Texas",
      start_date: "2025-10-25",
      end_date: "2025-10-26",
    },
  ];
  return (
    <section>
      <NavBar />
      <div className="dark bg-black p-5 rounded-2xl">
        <Table>
          <TableCaption>A list of Hackathons</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Hackathon</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hackathons.map((hackathon) => (
              <TableRow key={hackathon.name}>
                <TableCell className="font-medium text-white">
                  {hackathon.name}
                </TableCell>
                <TableCell className="text-white">{hackathon.format}</TableCell>
                <TableCell className="text-white">
                  {hackathon.location}
                </TableCell>
                <TableCell className="text-white">
                  {hackathon.start_date}
                </TableCell>
                <TableCell className="text-right text-white">
                  {hackathon.end_date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
