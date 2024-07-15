document.addEventListener("DOMContentLoaded", function () {
  const statsElement = document.getElementById("stats");

  // Dummy data for pool statistics
  const poolStats = {
    totalStake: "10,000,000 ADA",
    activeStake: "8,000,000 ADA",
    delegators: 250,
    epochRewards: "5%",
  };

  // Populate statistics
  statsElement.innerHTML = `
        <p>Total Stake: ${poolStats.totalStake}</p>
        <p>Active Stake: ${poolStats.activeStake}</p>
        <p>Number of Delegators: ${poolStats.delegators}</p>
        <p>Epoch Rewards: ${poolStats.epochRewards}</p>
    `;

  // Handle the join button click
  document.getElementById("join-button").addEventListener("click", function () {
    alert("Redirecting to delegation page...");
    // Implement redirection or further actions here
  });
});
