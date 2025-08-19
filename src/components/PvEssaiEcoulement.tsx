// src/pages/visites/PvEssaiEcoulement.tsx
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import {visiteService} from "../services/visiteService" // à adapter selon ton chemin

export default function PvEssaiEcoulement() {
  const { id } = useParams<{ id: string }>()
  const [visite, setVisite] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisite = async () => {
      try {
        setLoading(true)
        const { data } = await visiteService.getById(Number(id))
        console.log('Visite récupérée:', data)
        setVisite(data.data)
      } catch (error: any) {
        console.error(error)
        toast.error("Erreur lors du chargement de la visite")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchVisite()
  }, [id])

  if (loading) return <div className="p-10 text-center">Chargement...</div>
  if (!visite) return <div className="p-10 text-center">Aucune donnée disponible</div>

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">

    <div className="p-10 font-sans text-gray-900">
      {/* Header */}
      <div className="text-center mb-6">
        <img src="/logo-onee2.png" alt="ONEE Logo" className="mx-auto w-64" />
        {/* <p className="mt-2">
          N° …………………… ASG{visite.id}/202 &nbsp;&nbsp;&nbsp;&nbsp; {visite.dossierExecution.demande.ville}, le{" "}
          {new Date(visite.date).toLocaleDateString()}
        </p> */}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-center uppercase my-6">
        Procès verbal de {visite.typeVisite || "Visite"}
      </h1>

      {/* Objet */}
      <div className="mb-6 space-y-2">
        <p>
          <span className="font-bold">OBJET :</span>{" "}
          {visite.dossierExecution?.demande?.titre || "—"}
        </p>
        <p>
          <span className="font-bold">Type de demande :</span>{" "}
          {visite.dossierExecution?.demande?.type || "—"}
        </p>
        <p>
          <span className="font-bold">Responsable :</span>{" "}
          {visite.responsable?.firstName  || "—"}  {" "} {visite.responsable?.lastName || "—"}
        </p>
        {/* <p>
          <span className="font-bold">Entreprise :</span> ONEE /{" "}
          {visite.responsable?.lastName} {visite.responsable?.firstName}
        </p> */}
        {/* <p>
          Le {new Date(visite.date).toLocaleDateString()} à{" "}
          {new Date(visite.date).toLocaleTimeString()}
        </p> */}
      </div>

      {/* Remarques */}
      <div className="mb-6">
        <p className="font-bold">Avancement :</p>
        <p>{visite.remarques || "Aucune remarque"}</p>
      </div>

      {/* Conclusion */}
      <p className="text-center font-bold text-lg my-8">
        {visite.status === "EN_COURS"
          ? "La visite est en cours"
          : "Les essais sont concluants"}
      </p>

      {/* Signatures */}
      <div className="flex justify-between mt-12">
        <div>ONEE Branche Eau</div>
        {/* <div>
          {visite.dossierExecution?.demande?.clientId ? "Client" : "Société"}
        </div> */}
      </div>
    </div>
    </div>
  )
}
