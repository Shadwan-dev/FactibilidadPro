// src/pages/Home.jsx (VERSIÓN COMPLETA)
import React from 'react';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { Banner } from '../components/home/Banner';
import { Footer } from '../components/layout/Footer';

export function Home() {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <Features />
      <Banner />
      <Footer />
    </div>
  );
}