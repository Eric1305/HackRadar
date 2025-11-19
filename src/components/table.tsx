import "@/index.css";
import FavoriteButton from "./fav_btn";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Hackathon = {
  hackathon_id?: number;
  id?: number;
  name: string;
  state_region: string;
  start_date: string;
  end_date: string;
};

interface HackathonTableProps {
  data?: Hackathon[];
  loading?: boolean;
}

export default function HackathonTable({
  data = [],
  loading = false,
}: HackathonTableProps) {
  return (
    <div className="dark bg-black p-5 w-[660px] rounded-2xl  border shadow-sm border-gray-800 ">
      <Table>
        <TableCaption>
          {loading
            ? "Loading hackathons..."
            : `A list of ${data.length} Hackathons`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] text-center" aria-hidden>
              ★
            </TableHead>
            <TableHead className="w-[100px]">Hackathon</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-white py-8">
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Loading...
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-white py-8">
                No hackathons found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          ) : (
            data.map((hackathon) => (
              <TableRow key={hackathon.hackathon_id || hackathon.id}>
                <TableCell className="text-center text-white">
                  <FavoriteButton hackathon={hackathon} />
                </TableCell>
                <TableCell className="font-medium text-white w-[300px]">
                  {hackathon.name}
                </TableCell>
                <TableCell className="text-white w-[100px]">
                  {hackathon.state_region ? hackathon.state_region : "Virtual"}
                </TableCell>
                <TableCell className="text-white w-[100px]">
                  {hackathon.start_date.slice(0, 10)}
                </TableCell>
                <TableCell className=" text-white">
                  {hackathon.end_date.slice(0, 10)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
