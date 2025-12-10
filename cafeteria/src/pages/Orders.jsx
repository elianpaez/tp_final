import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/orders.css';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import jsPDF from 'jspdf';

const APP_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const formatPrice = (price) => `$${price.toFixed(2)}`;

const createPdfClient = (order) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const left = 40;
  let y = 40;

  doc.setFillColor(26, 18, 8);
  doc.setFontSize(18);
  doc.setTextColor(212,161,83);
  doc.text('Vitte Coffee — Factura', left, y);
  y += 30;

  doc.setFontSize(12);
  doc.setTextColor(0,0,0);
  doc.text(`Pedido: ${order.id}`, left, y); y += 16;
  const date = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString('es-AR') : 'Fecha no disponible';
  doc.text(`Fecha: ${date}`, left, y); y += 18;
  doc.text(`Cliente: ${order.customerName || ''}`, left, y); y += 18;
  doc.text(`Envío a: ${order.deliveryAddress || ''}`, left, y); y += 22;

  doc.setDrawColor(200);
  doc.line(left, y, 560, y); y += 18;

  doc.setFontSize(12);
  order.items.forEach((it, idx) => {
    doc.text(`${it.quantity} x ${it.name}`, left, y);
    const priceText = formatPrice(it.price * it.quantity);
    doc.text(priceText, 520, y, { align: 'right' });
    y += 16;
    if (it.options && Object.keys(it.options).length > 0) {
      doc.setFontSize(10);
      doc.text(Object.values(it.options).join(', '), left + 8, y);
      doc.setFontSize(12);
      y += 14;
    }
    if (y > 720) {
      doc.addPage();
      y = 40;
    }
  });

  doc.setDrawColor(200);
  doc.line(left, y + 6, 560, y + 6);
  y += 24;
  const total = order.total || order.items.reduce((s, it) => s + it.price * it.quantity, 0);
  doc.setFontSize(14);
  doc.text('Total:', left, y);
  doc.text(formatPrice(total), 520, y, { align: 'right' });

  const filename = `factura_${order.id.substring(0,8)}.pdf`;
  doc.save(filename);
};

const callResendFunction = async (orderId) => {
  const app = getApp();
  const functions = getFunctions(app);
  const fn = httpsCallable(functions, 'resendOrderPdf');
  const res = await fn({ orderId });
  return res.data;
};

const OrderCard = ({ order }) => {
  const totalAmount = order.total || order.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const date = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString('es-AR') : 'Fecha no disponible';

  return (
    <div className="order-card">
      <div className="order-top">
        <div>
          <div className="status-pill">Completado</div>
          <div className="order-id">Pedido #{order.id.substring(0,8)}</div>
        </div>
        <div className="order-date">{date}</div>
      </div>

      <div className="order-info-grid">
        <div className="info-block">
          <div className="info-label">Total pagado</div>
          <div className="info-value">{formatPrice(totalAmount)}</div>
        </div>
        <div className="info-block">
          <div className="info-label">Método</div>
          <div className="info-value" style={{ fontSize: 16, color: '#d4c4a1' }}>{order.paymentMethod || 'Tarjeta'}</div>
        </div>
      </div>

      <div className="order-items">
        <ul className="items-list">
          {order.items.map((it, i) => (
            <li key={i} className="item-row">
              <div className="item-left">
                <div className="item-name">{it.quantity}× {it.name}</div>
                {it.options && Object.keys(it.options).length > 0 && (
                  <div className="item-options">{Object.values(it.options).join(', ')}</div>
                )}
              </div>
              <div className="item-price">{formatPrice(it.price * it.quantity)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-footer">
        <div>Envío a: {order.deliveryAddress}</div>
        <div>Cliente: {order.customerName}</div>
        <div className="order-actions" style={{ marginTop: 10, justifyContent: 'flex-end' }}>
          <button className="btn secondary" onClick={() => createPdfClient(order)}>Descargar factura</button>
          <button className="btn" onClick={async () => { await callResendFunction(order.id); alert('Factura reenviada si el sistema procesó la orden.'); }}>Reenviar por email</button>
        </div>
      </div>
    </div>
  );
};

export function Orders() {
  const { currentUser, db, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser && db) {
      const userId = currentUser.uid;
      const ordersRef = collection(db, `artifacts/${APP_ID}/users/${userId}/orders`);
      const q = query(ordersRef);
      setIsLoadingOrders(true);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        fetched.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(fetched);
        setIsLoadingOrders(false);
      }, () => setIsLoadingOrders(false));
      return () => unsubscribe();
    }
  }, [currentUser, db, loading, navigate]);

  if (loading || isLoadingOrders) return <div className="orders-page"><h1 className="orders-title">Cargando órdenes...</h1></div>;
  if (!currentUser) return <div className="orders-page">Redirigiendo...</div>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">Historial de Compras</h1>
      <div className="order-wrapper">
        {orders.length === 0 ? (
          <div className="order-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#d4a153' }}>Aún no tienes pedidos</div>
            <div style={{ marginTop: 8, color: '#c2b4a5' }}>Explora el menú y realiza tu primera compra</div>
          </div>
        ) : (
          orders.map(o => <OrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
