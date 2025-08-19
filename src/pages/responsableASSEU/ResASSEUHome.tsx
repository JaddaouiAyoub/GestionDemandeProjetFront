import PvEssaiEcoulement from "../../components/PvEssaiEcoulement";

function ResASSEUHome() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Bienvenue dans votre espace Responsable</h2>
      <p className="text-gray-700">
        Ceci est la page d'accueil réservée aux Responsable.
      </p>
      <PvEssaiEcoulement />
    </div>
  )
}

export default ResASSEUHome;
