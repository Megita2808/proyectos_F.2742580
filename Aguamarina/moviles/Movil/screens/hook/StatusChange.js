// Cambios de Estado Reservas

export const approveReservationById = async (id) => {
    try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_approve/${id}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!data.ok || (Array.isArray(data.failedProducts) && data.failedProducts.length > 0)) {
            const failedProducts = data.failedProducts || [];
            throw new Error(
                JSON.stringify({
                    message: 'Esta Reserva no puede ser aprobada en estas fechas.',
                    failedProducts: failedProducts.map((product) => ({
                        name: product.name,
                        quantity: product.quantity,
                        disponibility: product.disponibility
                    }))
                })
            );
        }
        return true;
    } catch (error) {
        console.error("Error aprobando la reserva del usuario:", error.message);
        throw error;
    }
};


// Denegar, por parte de un vendedor
export const denyReservationById = async (id, cancel_reason) => {
    try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_deny/${id}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cancel_reason
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.body.isDennied) {
            throw new Error("La reserva no pudo ser denegada.");
        }
        return true;
    } catch (error) {
        console.error("Error denegando la reserva:", error);
        return false;
    }
};

// Cancelar, por parte del usuario
export const cancelReservationById = async (id, cancel_reason) => {
    try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_cancel/${id}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cancel_reason
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.body.isCanceled) {
            throw new Error("La reserva no pudo ser cancelada.");
        }
        return true;
    } catch (error) {
        console.error("Error cancelando la reserva del usuario:", error);
        return false;
    }
};

export const annularReservationById = async (id, cancel_reason) => {
    try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_annular/${id}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cancel_reason
            }),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.body.isAnnulled) {
            throw new Error("La reserva no pudo ser anulada.");
        }
        return true;
    } catch (error) {
        console.error("Error anulando la reserva del usuario:", error);
        return false;
    }
};

export const finalizeReservationById = async (id, data) => {
    console.log("datos del fetch: ", id, data);
    let datafinal = data
    try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/reservations_finalize/${id}`, {
            method: "PATCH",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                datafinal
            ),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.body.isFinalized) {
            throw new Error("La reserva no pudo ser finalizada.");
        }
        return true;
    } catch (error) {
        console.error("Error finalizando la reserva del usuario:", error);
        return false;
    }
};
