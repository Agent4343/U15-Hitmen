import { useEffect, useMemo, useState } from "react";

const TICKET_OPTIONS = [
  { id: 1, qty: 1, price: 5, label: "Starter", popular: false },
  { id: 2, qty: 3, price: 10, label: "Best Value", popular: true },
  { id: 3, qty: 8, price: 20, label: "Team Booster", popular: false },
];

const GAMES = [
  { day: "THU", date: "APR 16", time: "1:00 - 3:30 PM", opponent: "vs. Team NS" },
  { day: "FRI", date: "APR 17", time: "10:00 AM - 12:30 PM", opponent: "vs. Team PEI" },
  { day: "FRI", date: "APR 17", time: "7:00 - 9:30 PM", opponent: "vs. Tripen Osprey" },
  { day: "SAT", date: "APR 18", time: "3:00 - 5:30 PM", opponent: "vs. Team NB" },
];

const DRAW_DATE = "April 14, 2026";
const FACEBOOK_URL = "https://www.facebook.com/share/g/1E3h74upXv/?mibextid=wwXIfr";
const TEAM_PHOTO_URL =
  import.meta.env.VITE_TEAM_PHOTO_URL ||
  "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1400&q=80";
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || "hitmen2026";

const emptyForm = { name: "", email: "", phone: "" };

export default function App() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState("select");
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("hitmenOrders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("hitmenOrders", JSON.stringify(orders));
  }, [orders]);

  const selectedOption = useMemo(
    () => TICKET_OPTIONS.find((option) => option.id === selected),
    [selected],
  );

  const stats = useMemo(() => {
    const orderCount = orders.length;
    const ticketsSold = orders.reduce((sum, order) => sum + order.tickets, 0);
    const revenue = orders.reduce((sum, order) => sum + order.amount, 0);
    return { orderCount, ticketsSold, revenue };
  }, [orders]);

  const shareCaption = `We are helping the Eastern Hitmen U15 AAA get to Atlantics! Support the fundraiser and grab your tickets: ${window.location.href}`;

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
      errors.phone = "Enter a valid phone number.";
    }
    return errors;
  };

  const handleReview = () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) setStep("confirm");
  };

  const handlePay = async () => {
    if (!selectedOption) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const order = {
      id: `HIT-${Date.now().toString(36).toUpperCase()}`,
      ...form,
      tickets: selectedOption.qty,
      amount: selectedOption.price,
      date: new Date().toLocaleString(),
    };

    setOrders((previous) => [order, ...previous]);
    setLoading(false);
    setStep("success");
  };

  const copyShareText = async () => {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  const resetFlow = () => {
    setSelected(null);
    setForm(emptyForm);
    setFormErrors({});
    setStep("select");
  };

  if (adminOpen) {
    return (
      <main className="page">
        <section className="card admin-card">
          <button className="ghost-btn" onClick={() => setAdminOpen(false)}>
            Back to fundraiser
          </button>
          {!adminAuthed ? (
            <div className="admin-login">
              <h2>Admin Access</h2>
              <p>Enter your admin passcode to view orders.</p>
              <input
                type="password"
                placeholder="Passcode"
                value={adminPinInput}
                onChange={(event) => setAdminPinInput(event.target.value)}
              />
              <button
                className="primary-btn"
                onClick={() => {
                  if (adminPinInput === ADMIN_PASSCODE) {
                    setAdminAuthed(true);
                    setAdminPinInput("");
                  }
                }}
              >
                Unlock
              </button>
            </div>
          ) : (
            <>
              <header className="admin-header">
                <h2>Ticket Orders</h2>
                <button
                  className="ghost-btn"
                  onClick={() => {
                    setAdminAuthed(false);
                    setAdminPinInput("");
                  }}
                >
                  Lock
                </button>
              </header>

              <div className="admin-stats">
                <article>
                  <strong>{stats.orderCount}</strong>
                  <span>Orders</span>
                </article>
                <article>
                  <strong>{stats.ticketsSold}</strong>
                  <span>Tickets</span>
                </article>
                <article>
                  <strong>${stats.revenue}</strong>
                  <span>Revenue</span>
                </article>
              </div>

              <div className="table-wrap">
                {orders.length === 0 ? (
                  <p className="muted">No orders yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Tickets</th>
                        <th>Paid</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.name}</td>
                          <td>{order.email}</td>
                          <td>{order.phone}</td>
                          <td>{order.tickets}</td>
                          <td>${order.amount}</td>
                          <td>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <header className="hero">
          <p className="badge">FUNDRAISER</p>
          <h1>Eastern Hitmen U15 AAA</h1>
          <p className="subhead">Atlantic Hockey Championship</p>
        </header>

        <section className="hero-photo-wrap">
          <img src={TEAM_PHOTO_URL} alt="Eastern Hitmen U15 AAA team" className="hero-photo" />
        </section>

        <section className="story">
          <h2>Help Us Get to Atlantics</h2>
          <p>
            Our players earned the chance to represent our region in Clarenville, NL. Every ticket
            purchased helps cover travel, accommodations, and tournament costs for the team.
          </p>
          <p>
            You are not just buying a ticket. You are backing these athletes and helping create a
            lifetime memory.
          </p>
        </section>

        <section className="prize">
          <p className="prize-label">GRAND PRIZE</p>
          <p className="prize-value">$500</p>
          <p className="prize-desc">Gift Card Basket</p>
          <small>Groceries • Gas • Shopping • Dining</small>
          <p className="draw-date">Draw date: {DRAW_DATE}</p>
        </section>

        <section className="social">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
            Follow us on Facebook
          </a>
          <button className="ghost-btn" onClick={copyShareText}>
            {copyState === "copied"
              ? "Caption copied!"
              : copyState === "failed"
                ? "Copy failed"
                : "Copy Facebook caption"}
          </button>
        </section>

        <section className="schedule">
          <h3>Game Schedule</h3>
          <p>Clarenville Events Centre, NL</p>
          {GAMES.map((game) => (
            <div key={`${game.date}-${game.time}`} className="game-row">
              <div className="game-date">
                <span>{game.day}</span>
                <strong>{game.date}</strong>
              </div>
              <div>
                <p>{game.time}</p>
                <small>{game.opponent}</small>
              </div>
            </div>
          ))}
        </section>

        {step === "select" && (
          <section className="flow">
            <h3>Choose tickets</h3>
            <div className="ticket-grid">
              {TICKET_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`ticket-card ${selected === option.id ? "selected" : ""}`}
                  onClick={() => setSelected(option.id)}
                >
                  {option.popular ? <span className="popular">BEST VALUE</span> : null}
                  <strong>{option.qty}</strong>
                  <span>{option.qty > 1 ? "TICKETS" : "TICKET"}</span>
                  <em>${option.price}</em>
                  <small>{option.label}</small>
                </button>
              ))}
            </div>
            <button
              className="primary-btn"
              disabled={!selected}
              onClick={() => selected && setStep("info")}
            >
              Continue
            </button>
          </section>
        )}

        {step === "info" && (
          <section className="flow">
            <h3>Your information</h3>
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="John Smith"
              />
              {formErrors.name ? <small className="error">{formErrors.name}</small> : null}
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="john@email.com"
              />
              {formErrors.email ? <small className="error">{formErrors.email}</small> : null}
            </label>

            <label>
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="(506) 555-1234"
              />
              {formErrors.phone ? <small className="error">{formErrors.phone}</small> : null}
            </label>

            <div className="row">
              <button className="ghost-btn" onClick={() => setStep("select")}>
                Back
              </button>
              <button className="primary-btn" onClick={handleReview}>
                Review Order
              </button>
            </div>
          </section>
        )}

        {step === "confirm" && selectedOption && (
          <section className="flow">
            <h3>Confirm order</h3>
            <div className="summary">
              <p>
                <span>Tickets</span>
                <strong>{selectedOption.qty}</strong>
              </p>
              <p>
                <span>Name</span>
                <strong>{form.name}</strong>
              </p>
              <p>
                <span>Email</span>
                <strong>{form.email}</strong>
              </p>
              <p className="total">
                <span>Total</span>
                <strong>${selectedOption.price}.00</strong>
              </p>
            </div>
            <div className="row">
              <button className="ghost-btn" onClick={() => setStep("info")}>
                Back
              </button>
              <button className="pay-btn" onClick={handlePay} disabled={loading}>
                {loading ? "Processing..." : `Pay $${selectedOption.price}.00`}
              </button>
            </div>
            <p className="trust-text">Secure checkout ready for Stripe integration.</p>
          </section>
        )}

        {step === "success" && (
          <section className="flow success">
            <h3>You are in!</h3>
            <p>
              Thank you for supporting the team. A confirmation has been created for{" "}
              <strong>{form.email}</strong>.
            </p>
            <button className="primary-btn" onClick={resetFlow}>
              Buy more tickets
            </button>
          </section>
        )}

        <footer>
          <p>All proceeds support Eastern Hitmen U15 AAA travel costs.</p>
          <button className="admin-link" onClick={() => setAdminOpen(true)}>
            Admin
          </button>
        </footer>
      </section>
    </main>
  );
}
