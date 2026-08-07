const people = ["Segun", "Debo", "Toyo", "Prada"];
const jobs = ["Bathroom & Toilet", "Living Room, Staircase & Bin", "Kitchen"];
const rota = [
  { date: "2026-08-03", assignments: ["Segun", "Debo", "Toyo"] },
  { date: "2026-08-10", assignments: ["Prada", "Toyo", "Segun"] },
  { date: "2026-08-17", assignments: ["Debo", "Segun", "Prada"] },
  { date: "2026-08-24", assignments: ["Debo", "Toyo", "Prada"] }
];
// From September onward, HomeTurn uses a shared balanced four-week cycle.
// Over each cycle, every person has three jobs (one of each type) and one week off.
function addWeeks(date, weeks) { const next = new Date(`${date}T00:00:00`); next.setDate(next.getDate() + weeks * 7); return next.toISOString().slice(0, 10); }
function balancedPeople(weekNumber) {
  const start = (weekNumber - 1) % people.length;
  return [
    people[start],
    people[(start + 1) % people.length],
    people[(start + 2) % people.length]
  ];
}
const futureRota = Array.from({ length: 104 }, (_, index) => ({
  date: addWeeks(rota[rota.length - 1].date, index + 1),
  assignments: balancedPeople(index + 2)
}));
const fullRota = [...rota, ...futureRota];
const responsibilities = {
  "Bathroom & Toilet": ["Clean toilet, sink, and bath or shower.", "Wipe mirrors and surfaces.", "Mop the floor."],
  "Living Room, Staircase & Bin": ["Hoover and wipe down the living room.", "Hoover the staircase.", "Empty all household bins and put them out if collection falls that week."],
  "Kitchen": ["Wipe down worktops.", "Clean cupboard doors.", "Wipe appliances externally.", "Sweep and mop the floor.", "Leave the kitchen tidy."]
};
const dateFormat = new Intl.DateTimeFormat("en-GB", { day:"numeric", month:"long", year:"numeric" });
const shortFormat = new Intl.DateTimeFormat("en-GB", { day:"numeric", month:"short" });
const today = new Date(); today.setHours(0,0,0,0);
function weekDate(date) { return new Date(`${date}T00:00:00`); }
function currentIndex() { const first = weekDate(fullRota[0].date); const days = Math.floor((today-first)/86400000); return Math.max(0, Math.min(Math.floor(days / 7), fullRota.length - 1)); }
const active = currentIndex();
document.querySelector("#current-title").textContent = `Week commencing ${dateFormat.format(weekDate(fullRota[active].date))}`;
document.querySelector("#currentRota").innerHTML = fullRota[active].assignments.map((person,i) => `<div class="assignment"><span>${jobs[i]}</span><strong>${person}</strong></div>`).join("");
document.querySelector("#schedule").innerHTML = fullRota.map((week,index) => `<article class="week ${index===active?"current-week":""}"><h3>From ${shortFormat.format(weekDate(week.date))}${index >= rota.length - 1 ? " · Balanced rota" : ""}</h3>${week.assignments.map((person,i)=>`<p><b>${jobs[i]}</b>${person}</p>`).join("")}</article>`).join("");
document.querySelector("#responsibilities").innerHTML = Object.entries(responsibilities).map(([job,tasks]) => `<div class="responsibility"><h3>${job}</h3><ul>${tasks.map(task=>`<li>${task}</li>`).join("")}</ul></div>`).join("");
for (const id of ["requester","swapWith"]) document.querySelector(`#${id}`).innerHTML = `<option value="" disabled selected>Select a name</option>${people.map(person=>`<option>${person}</option>`).join("")}`;
document.querySelector("#week").innerHTML = fullRota.map(week=>`<option value="${week.date}">Week commencing ${dateFormat.format(weekDate(week.date))}</option>`).join("");
document.querySelector("#swapForm").addEventListener("submit", event => { event.preventDefault(); const requester=document.querySelector("#requester").value; const other=document.querySelector("#swapWith").value; const message=document.querySelector("#formMessage"); if(requester===other) { message.textContent="Choose another person for the swap."; return; } message.textContent="Swap request sent to the organiser for approval."; event.target.reset(); });
document.querySelector("#notifyButton").addEventListener("click", async () => { const button=document.querySelector("#notifyButton"); if (!('Notification' in window)) { button.textContent="Reminders unavailable"; return; } const result=await Notification.requestPermission(); button.textContent=result==='granted'?"Reminders enabled":"Reminders not enabled"; });
let installPrompt; window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt=event; document.querySelector("#installButton").hidden=false; });
document.querySelector("#installButton").addEventListener("click", async () => { if(!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt=null; document.querySelector("#installButton").hidden=true; });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js');

