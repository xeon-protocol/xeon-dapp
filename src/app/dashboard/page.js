"use client";
import React from "react";
import Card from "@/components/Card";
import CenterNav from "@/components/dashboard/CenterNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Layout from "@/components/dashboard/Layout";
import NoEvents from "@/components/NoEvents";

export default function Dashboard() {
  const [showPositions, setShowPositions] = React.useState(false);
  const [showDiscover, setShowDiscover] = React.useState(true);
  const [showBookmarks, setShowBookmarks] = React.useState(false);
  return (
    <div className="bg-[#000] min-h-[100vh] px-8 pt-8 max-w-screen-2xl mx-auto">
      <Header />
      <div className="mt-32">
        <Layout>
          <CenterNav
            setShowBookmarks={setShowBookmarks}
            setShowDiscover={setShowDiscover}
            setShowPositions={setShowPositions}
          />
        </Layout>
      </div>
      <Footer />
    </div>
  );
}
