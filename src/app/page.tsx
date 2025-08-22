import { supabase } from "@/lib/supabase/client"
import { Ui } from "@/components/v0/ui"

export default async function HomePage() {
	const { data, error } = await supabase
		.from("ephemerides")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(1)

	if (error) {
		return <div>Error al cargar la efeméride: {error.message}</div>
	}

	if (!data || (Array.isArray(data) && data.length === 0)) {
		return <div>No hay efemérides disponibles.</div>
	}

	const ephemeris = Array.isArray(data) ? data[0] : data

	// Pasa los datos a tu componente de v0
	return <Ui ephemeris={ephemeris} />
}