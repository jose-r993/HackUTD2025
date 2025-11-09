from sqlalchemy.orm import Session
from app.models.orm import Ticket
from app.models.schemas import TicketCreate, TicketUpdate, TicketOut

class TicketService:
    def create_ticket(self, db: Session, ticket_data: TicketCreate):
        ticket = Ticket(**ticket_data.dict())
        db.add(ticket)
        db.commit()
        db.refresh(ticket)
        return ticket

    def get_all_tickets(self, db: Session):
        return db.query(Ticket).order_by(Ticket.created_at.desc()).all()

    def get_ticket_by_id(self, db: Session, ticket_id: int):
        return db.query(Ticket).filter(Ticket.id == ticket_id).first()

    def update_ticket(self, db: Session, ticket_id: int, update_data: TicketUpdate):
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            return None
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(ticket, field, value)
        db.commit()
        db.refresh(ticket)
        return ticket

    def delete_ticket(self, db: Session, ticket_id: int):
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            return None
        db.delete(ticket)
        db.commit()
        return True
