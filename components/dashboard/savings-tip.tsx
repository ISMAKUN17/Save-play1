'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPersonalizedTipAction } from "@/lib/actions";
import Link from 'next/link';

export function SavingsTip() {
  const [tip, setTip] = useState("¡Automatiza tu ahorro y olvídate! 🤖");
  const [loading, setLoading] = useState(false);

  const fetchTip = async () => {
    setLoading(true);
    try {
      const result = await getPersonalizedTipAction();
      if (result.tip) {
        setTip(result.tip);
      }
    } catch (error) {
      console.error("Failed to fetch savings tip:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchTip(); // Uncomment to fetch tip on component mount
  }, []);

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tips de Super Ahorro 🧠💡</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-center text-muted-foreground">Generando un consejo para ti...</p>
        ) : (
          <p className="text-center text-lg font-medium">"{tip}"</p>
        )}
        <div className="flex flex-col gap-2">
            <Button onClick={fetchTip} disabled={loading} variant="secondary" className="neumorphic-raised">
                {loading ? 'Pensando...' : 'Dame otro consejo ✨'}
            </Button>
            <Button asChild variant="outline" className="w-full neumorphic-inset hover:neumorphic-raised">
                <Link href="/debts">
                    Revisa tus Deudas ⛓️
                </Link>
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
