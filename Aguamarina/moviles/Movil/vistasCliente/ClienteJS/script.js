function showDescription(eventNumber) {
    const overlay = document.getElementById("overlay");
    const description = document.getElementById("event-description");
    const descriptionText = document.getElementById("event-description-text");

    // Aquí deberías tener la descripción real de tus eventos
    const descriptions = [
        "Ven y únete a nosotros para celebrar el cumpleaños número 30 de [Nombre del Cumpleañero]. La noche estará llena de música, baile y diversión. Habrá un DJ en vivo, un buffet de comida deliciosa y, por supuesto, un pastel para soplar las velas. ¡Ven y celebra este hito especial con amigos y familiares!",
        "Prepárate para una noche espeluznante en nuestra Fiesta de Halloween. Vístete con tu disfraz más aterrador y únete a la diversión. Habrá concursos de disfraces, música de terror y deliciosos cócteles temáticos. ¡Es la oportunidad perfecta para disfrutar de una noche de miedo!",
        "Es hora de celebrar los logros académicos de [Nombre del Graduado]. Únete a nosotros en una fiesta de graduación llena de alegría y emoción. Habrá música, baile y un buffet delicioso. ¡Acompáñanos para celebrar este hito importante en la vida de [Nombre del Graduado]!",
        "Ven y celebra la temporada navideña con nosotros en nuestra Fiesta de Navidad. Habrá luces brillantes, decoraciones festivas y un ambiente acogedor. Disfruta de una cena tradicional de Navidad, intercambio de regalos y villancicos. ¡Es la manera perfecta de compartir la alegría de la Navidad con amigos y seres queridos!",
        "Únete a nosotros para celebrar el increíble hito de 50 años de amor y compromiso de [Nombres de los Anfitriones]. Será una noche de nostalgia y alegría, con música en vivo, baile y una cena elegante. [Nombres de los Anfitriones] nos inspiran a todos, y esta fiesta es nuestra manera de honrar su amor duradero. ¡Ven a celebrar con nosotros!",
        "Apuesta y diviértete en nuestra emocionante Fiesta Temática de Casino. La noche estará llena de juegos de cartas, ruleta y máquinas tragamonedas. Ven a disfrutar de cócteles exclusivos y deliciosos aperitivos mientras pruebas tu suerte en las mesas de juego. ¿Quién sabe? ¡Podrías ser el gran ganador de la noche!",
        "Únete a nosotros en un día lleno de diversión, juegos y comida al aire libre en nuestro Picnic Familiar en el Parque. Trae a toda la familia y disfruta de actividades como carreras de sacos, voleibol y una deliciosa barbacoa. Es la oportunidad perfecta para crear recuerdos especiales juntos.",
        "Invitamos a todos los niños a un emocionante Taller de Arte donde podrán explorar su creatividad. Guiados por artistas experimentados, los niños crearán sus propias obras maestras utilizando una variedad de medios artísticos. Este taller fomenta la imaginación y la expresión artística de los más jóvenes.",
    ];

    descriptionText.textContent = descriptions[eventNumber - 1];
    overlay.style.display = "block";
}

function hideDescription() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}


