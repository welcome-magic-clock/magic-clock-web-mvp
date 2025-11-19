type Params = { params: { id: string } }
export default function ProfilePage({ params }: Params) {
  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-black">Profil créateur — {params.id}</h1>
      <p className="text-slate-600">Bio, portfolio, accès FREE/ABO/PPV (à venir).</p>
    </main>
  )
}