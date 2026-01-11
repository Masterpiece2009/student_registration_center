import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    guardian_phone: "",
    level: "ابتدائي",
    year: "أول",
  });
  const [subjects, setSubjects] = useState([
    { subject: "", teacher: "", group: "", schedule: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function updateSubject(idx, key, value) {
    const copy = subjects.map((s, i) => (i === idx ? { ...s, [key]: value } : s));
    setSubjects(copy);
  }

  function addSubject() {
    setSubjects([...subjects, { subject: "", teacher: "", group: "", schedule: "" }]);
  }
  function removeSubject(idx) {
    setSubjects(subjects.filter((_, i) => i !== idx));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const payload = { ...form, subjects };
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: "تم الإرسال بنجاح. رقم الطالب: " + data.student_id });
        setForm({
          full_name: "",
          phone: "",
          whatsapp: "",
          guardian_phone: "",
          level: "ابتدائي",
          year: "أول",
        });
        setSubjects([{ subject: "", teacher: "", group: "", schedule: "" }]);
      } else {
        setMsg({ type: "error", text: data.error || "حدث خطأ" });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message || "خطأ في الاتصال" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>نموذج تسجيل الطلاب</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>الاسم الكامل</label><br />
          <input name="full_name" value={form.full_name} onChange={updateField} required />
        </div>
        <div>
          <label>رقم التليفون</label><br />
          <input name="phone" value={form.phone} onChange={updateField} required />
        </div>
        <div>
          <label>واتساب</label><br />
          <input name="whatsapp" value={form.whatsapp} onChange={updateField} />
        </div>
        <div>
          <label>رقم ولي الأمر</label><br />
          <input name="guardian_phone" value={form.guardian_phone} onChange={updateField} />
        </div>
        <div>
          <label>المرحلة</label><br />
          <select name="level" value={form.level} onChange={updateField}>
            <option>ابتدائي</option>
            <option>اعدادي</option>
            <option>ثانوي</option>
          </select>
        </div>
        <div>
          <label>السنة</label><br />
          <select name="year" value={form.year} onChange={updateField}>
            <option>أول</option>
            <option>ثانية</option>
            <option>ثالثة</option>
          </select>
        </div>

        <hr />
        <h3>المواد (يمكن إضافة أكثر من مادة)</h3>
        {subjects.map((s, idx) => (
          <div key={idx} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
            <div>
              <label>المادة</label><br />
              <input value={s.subject} onChange={(e) => updateSubject(idx, "subject", e.target.value)} required />
            </div>
            <div>
              <label>المدرس</label><br />
              <input value={s.teacher} onChange={(e) => updateSubject(idx, "teacher", e.target.value)} />
            </div>
            <div>
              <label>المجموعة</label><br />
              <input value={s.group} onChange={(e) => updateSubject(idx, "group", e.target.value)} />
            </div>
            <div>
              <label>المواعيد</label><br />
              <input value={s.schedule} onChange={(e) => updateSubject(idx, "schedule", e.target.value)} />
            </div>
            <div style={{ marginTop: 6 }}>
              <button type="button" onClick={() => removeSubject(idx)} disabled={subjects.length === 1}>
                حذف مادة
              </button>
            </div>
          </div>
        ))}
        <div>
          <button type="button" onClick={addSubject}>إضافة مادة</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "جارٍ الإرسال..." : "أرسل"}</button>
        </div>
      </form>

      {msg && (
        <div style={{ marginTop: 12, color: msg.type === "error" ? "red" : "green" }}>
          {msg.text}
        </div>
      )}

      <p style={{ marginTop: 24, color: "#666" }}>
        سيُنشأ student_id تلقائياً، ويُسجّل السجل في Google Sheet مع الحالة الافتراضية "pending".
      </p>
    </div>
  );
}
