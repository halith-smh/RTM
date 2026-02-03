import { GitBranch, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RTMPlaceholder() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Requirements Traceability Matrix</h2>
          <p className="text-muted-foreground">Comprehensive traceability and relationship mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <GitBranch className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Traceability Matrix</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              View and manage requirement relationships and dependencies
            </p>
            <Button variant="outline" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <ArrowRight className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Analyze the impact of requirement changes across the system
            </p>
            <Button variant="outline" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <GitBranch className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Coverage Reports</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Generate comprehensive coverage and traceability reports
            </p>
            <Button variant="outline" className="w-full">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">RTM Features in Development</h3>
            <p className="text-muted-foreground mb-4">
              The Requirements Traceability Matrix module is currently under development. 
              It will provide comprehensive traceability features including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Bidirectional traceability
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Dependency mapping
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Change impact analysis
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Coverage reporting
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Compliance tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Visual relationship graphs
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}