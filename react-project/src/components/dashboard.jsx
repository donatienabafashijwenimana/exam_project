import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import votingData from "../datasource.js";          

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  const barLabels = votingData.posts.slice(0, 5).map((p) => p.title);
  const barValues = barLabels.map((title) => {
    const post = votingData.posts.find((p) => p.title === title);
    const postCandidates = votingData.candidates.filter((c) => c.postId === post.id);
   
    return postCandidates.reduce((sum, c) => sum + c.votes, 0);
  });

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Total Votes per Post",
        data: barValues,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      },
    ],
  };

  const totalVoters = votingData.voters.length;
  const voted = votingData.voters.filter((v) => v.hasVoted).length;
  const notVoted = totalVoters - voted;

  const pieData = {
    labels: ["Voted", "Not Voted"],
    datasets: [
      {
        data: [voted, notVoted],
        backgroundColor: ["#10b981", "#ef4444"],
      },
    ],
  };
  const totalPosts = votingData.posts.length;
  const totalCandidates = votingData.candidates.length;
  const totalVotersRegistered = votingData.voters.filter((v) => v.registered).length;
  const totalActivePosts = votingData.posts.filter((p) => p.status === "active").length;

  return (
    <div className="dash-container">
      {/* Top Charts */}
      <div className="dash-top">
        <div className="card">
          <Bar height="100%" width={'100%'} data={barData} />
        </div>
        <div className="card card-top">
          <Pie height="100%" width="100%" data={pieData} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="dash-main">
        <div className="card small">
          <div className="card-title">Total Posts</div>
          <span className="card-no">({totalPosts})</span>
        </div>

        <div className="card small">
          <div className="card-title">Total Candidates</div>
          <span className="card-no">({totalCandidates})</span>
        </div>

        <div className="card small">
          <div className="card-title">Registered Voters</div>
          <span className="card-no">({totalVotersRegistered})</span>
        </div>

        <div className="card small">
          <div className="card-title">Active Posts</div>
          <span className="card-no">({totalActivePosts})</span>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;